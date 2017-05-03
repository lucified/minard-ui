export const selectText = (e: React.MouseEvent<HTMLElement>) => {
  const node = e.target;
  const doc = document as any;

  if (doc.selection) {
    const range = doc.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(node as Node);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
};
