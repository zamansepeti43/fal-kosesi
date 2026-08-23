export type CoffeeZone="kenar"|"orta"|"dip"|"sap"|"karşı";
export type SymbolCategory="aşk"|"para"|"iş"|"haber"|"yol"|"kısmet"|"genel";
export type CoffeeSymbol={id:string;name:string;category:SymbolCategory;meaning:string;zones:CoffeeZone[]};

export const coffeeSymbols:CoffeeSymbol[]=[
{id:"bird",name:"Kuş",category:"haber",meaning:"Haber, mesaj veya beklenen bir gelişmenin yaklaşması.",zones:["kenar","orta"]},
{id:"heart",name:"Kalp",category:"aşk",meaning:"Duygusal yakınlık, sevgi veya gönül meselesi.",zones:["kenar","orta","dip"]},
{id:"key",name:"Anahtar",category:"kısmet",meaning:"Yeni bir kapının açılması, çözüm veya fırsat.",zones:["orta","dip"]},
{id:"road",name:"Yol",category:"yol",meaning:"Seyahat, hareket veya hayatında yeni bir yön.",zones:["kenar","orta"]},
{id:"ring",name:"Halka",category:"aşk",meaning:"Bağlılık, söz, anlaşma veya tamamlanan bir döngü.",zones:["orta","dip"]},
{id:"tree",name:"Ağaç",category:"genel",meaning:"Büyüme, köklenme ve zamanla güçlenen bir süreç.",zones:["orta","dip"]},
{id:"eye",name:"Göz",category:"genel",meaning:"Dikkat, sezgi ve çevreden gelen bakışlara karşı farkındalık.",zones:["kenar","orta"]},
{id:"mountain",name:"Dağ",category:"iş",meaning:"Aşılması gereken bir engel; sabırla gelen sonuç.",zones:["dip","orta"]}
];

export function buildReadingPrompt(context:string){return `Sen Fal Köşesi'nin deneyimli, sıcak ve eğlenceli kahve falcısısın. ${context}\n\nYorumunu kesin gelecek iddiası olarak değil, geleneksel fal sembollerinin eğlenceli ve kişisel bir yorumu olarak sun. Önce fincanda görülen sembolleri ve konumlarını açıkla; sonra aşk, para/kısmet, iş ve yakın gelecek başlıklarında akıcı bir yorum yap. Korkutucu, kesin veya tıbbi/hukuki/finansal karar yönlendiren ifadeler kullanma. Sonunda kullanıcıya fincanıyla ilgili tek bir doğal takip sorusu sor.`}
