/** Một khối nội dung: đoạn văn, hoặc danh sách gạch đầu dòng. */
export type LegalBlock = string | { list: string[] };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  path: string;
  title: string;
  description: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  englishSummary?: string;
}
