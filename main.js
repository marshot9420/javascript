import { tokenize } from "./projects/token-inspector/tokenizer";

const sourceCodeElement = document.querySelector("#source-code");
const analyzeButtonElement = document.querySelector("#analyze-button");
const resultElement = document.querySelector("#result");

if (
  !(sourceCodeElement instanceof HTMLTextAreaElement) ||
  !(analyzeButtonElement instanceof HTMLButtonElement) ||
  !(resultElement instanceof HTMLPreElement)
) {
  throw new Error("필요한 DOM 요소를 찾을 수 없습니다.");
}

analyzeButtonElement.addEventListener("click", () => {
  const sourceText = sourceCodeElement.value;
  const tokens = tokenize(sourceText);

  console.clear();
  console.log(tokens);

  resultElement.textContent = JSON.stringify(tokens, null, 2);
});
