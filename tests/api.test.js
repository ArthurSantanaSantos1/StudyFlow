global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        slip: {
          advice: "Never stop learning."
        }
      })
  })
);

test("deve retornar uma dica da API", async () => {
  const resposta = await fetch("https://api.adviceslip.com/advice");
  const dados = await resposta.json();

  expect(dados.slip.advice).toBe("Never stop learning.");
});