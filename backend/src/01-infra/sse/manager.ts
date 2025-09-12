type Event = 'detection'

type CustomerID = string
type Connect = { customerID: string; writer: WritableStreamDefaultWriter }
type Write = { customerID: string; event: Event; message: string }

export class SSEManager {
  private static connections = new Map<CustomerID, WritableStreamDefaultWriter>()

  static connect({ customerID, writer }: Connect): void {
    this.connections.set(customerID, writer)
  }

  static async disconnect(customerID: string): Promise<void> {
    const writer = this.connections.get(customerID)
    await writer?.close()
    this.connections.delete(customerID)
  }

  static async write({ customerID, event, message }: Write): Promise<void> {
    const writer = this.connections.get(customerID)
    await writer?.write(`event: ${event}\ndata: ${message}\n\n`)
  }

  static heartbeat(): void {
    setInterval(async () => {
      for (const [, writer] of Array.from(this.connections)) {
        await writer.write(`: heartbeat\n\n`).catch()
      }
    }, 15_000)
  }
}
