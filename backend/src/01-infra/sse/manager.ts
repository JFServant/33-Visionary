type Event = 'detection'
type Message = 'success' | 'failure'

type CustomerID = string
type Connect = { customerID: string; writer: WritableStreamDefaultWriter }
type Disconnect = { customerID: string; writer: WritableStreamDefaultWriter }
type Push = { customerID: string; event: Event }
type Write = { customerID: string; event: Event; message: Message }
type Send = { customerID: string; writer: WritableStreamDefaultWriter; payload: string }

export class SSEManager {
  private static connections = new Map<CustomerID, Set<WritableStreamDefaultWriter>>()

  static connect({ customerID, writer }: Connect): void {
    const writers = this.connections.get(customerID) ?? new Set<WritableStreamDefaultWriter>()

    writers.add(writer)
    this.connections.set(customerID, writers)
  }

  static async disconnect({ customerID, writer }: Disconnect): Promise<void> {
    const writers = this.connections.get(customerID)

    if (!writers?.has(writer)) return

    writers.delete(writer)
    await writer.close().catch(() => {})

    if (!writers.size) this.connections.delete(customerID)
  }

  static success({ customerID, event }: Push): Promise<void> {
    return this.write({ customerID, event, message: 'success' })
  }

  static failure({ customerID, event }: Push): Promise<void> {
    return this.write({ customerID, event, message: 'failure' })
  }

  static heartbeat(): void {
    setInterval(() => this.broadcast(`: heartbeat\n\n`), 15_000)
  }

  private static async write({ customerID, event, message }: Write): Promise<void> {
    const writers = this.connections.get(customerID)

    if (!writers) return

    const payload = `event: ${event}\ndata: ${message}\n\n`

    await Promise.all(Array.from(writers, (writer) => this.send({ customerID, writer, payload })))
  }

  private static async broadcast(payload: string): Promise<void> {
    await Promise.all(
      Array.from(this.connections, ([customerID, writers]) =>
        Array.from(writers, (writer) => this.send({ customerID, writer, payload }))
      ).flat()
    )
  }

  private static async send({ customerID, writer, payload }: Send): Promise<void> {
    await writer.write(payload).catch(() => this.disconnect({ customerID, writer }))
  }
}
