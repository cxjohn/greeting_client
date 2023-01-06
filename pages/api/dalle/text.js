const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (req, res) => {
  let prompt = `Write a hallmark greeting card greeting based off categories: \n\nChristmas: May the spirit of Christmas fill your heart with peace love.\nHumour: Roses are red, violets are blue, I'm glad we're friends and not related to you!\nThank you: Thank you for being such a special and thoughtful person. Your kindness and generosity are truly appreciated, and I am grateful to have you in my life. You make a difference in so many ways, and I just wanted to say thank you for everything you do. You truly are a blessing!\nWedding: Congratulations on your special day! May your love for each other grow stronger with each passing year. Wishing you a lifetime of happiness and love as you embark on this beautiful journey together. Best wishes on your wedding day!\nBirthday: As you celebrate another year of life, may you be surrounded by love, laughter, and all your favorite things. May this day be filled with memories to treasure and moments to cherish. Here's to another amazing year of life!\n${req.body.name}:`;
  const gptResponse = await openai.complete({
    engine: "davinci",
    prompt: prompt,
    maxTokens: 100,
    temperature: 0.2,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0.5,
    bestOf: 1,
    n: 1,
    stop: "\n",
  });
  console.log("gptResponse", JSON.stringify(gptResponse.data.choices));
  res.status(200).json({ text: `${gptResponse.data.choices[0].text}` });
};
