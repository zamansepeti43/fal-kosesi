export type VisionInput={imageUrls:string[];question?:string;context?:string};
export type ReadingResult={summary:string;symbols:Array<{name:string;zone:string;meaning:string}>;sections:{love:string;career:string;money:string;future:string};followUpQuestion:string};

export interface FortuneProvider{analyzeCoffee(input:VisionInput):Promise<ReadingResult>}

export function getConfiguredProvider(){
  const provider=process.env.AI_PROVIDER||"none";
  if(provider==="none") return null;
  throw new Error(`AI provider adapter '${provider}' is not implemented yet. Add it under lib/ai/providers/.`);
}
