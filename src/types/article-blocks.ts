export type ParagraphBlock = {
  type: "PARAGRAPH";
  layout: "DEFAULT";
  content: {
    text: string;
  };
};

export type ImageTextBlock = {
  type: "IMAGE_TEXT";
  layout: "SPLIT";
  content: {
    imageAssetId: string;
    title?: string;
    text: string;
  };
};
