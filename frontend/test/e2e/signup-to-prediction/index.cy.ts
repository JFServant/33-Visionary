describe('signup to prediction', () => {
  it('signs up, uploads an image, and lands on the listing with its prediction', () => {
    const email = `e2e-${Date.now()}@test.dev`

    cy.visit('/identity/signup')

    cy.get('input[name=username]').type('e2euser')
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type('Passw0rd!')
    cy.contains('button', 'Sign Up').click()

    cy.location('pathname').should('eq', '/image/listing')

    cy.visit('/image/upload')
    cy.get('input[type=file]').selectFile('test/e2e/signup-to-prediction/dog.jpg', { force: true })
    cy.contains('button', 'Upload').click()

    cy.location('pathname', { timeout: 60_000 }).should('eq', '/image/listing')

    cy.get('img[alt^="Possibly Detected: "]', { timeout: 15_000 })
      .should('have.attr', 'alt')
      .and('match', /Possibly Detected: [A-Z]/)
  })
})
