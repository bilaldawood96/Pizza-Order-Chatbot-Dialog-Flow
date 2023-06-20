import express from "express";
import morgan from "morgan";
import moment from "moment";
import momentTZ from "moment-timezone";


const app = express();
app.use(express.json());
app.use(morgan('dev'))


const PORT = process.env.PORT || 3000;
app.get("/ping", (req, res) => {
  res.send("Pakistan Zindabad2");});


const webhookRequest = {
    "responseId": "response-id",
    "session": "projects/project-id/agent/sessions/session-id",
    "queryResult": {
      "queryText": "End-user expression",
      "parameters": {
        "param-name0": "param-value",
        "param-name1": "param-value",
        "param-name2": "param-value",
      },
      "allRequiredParamsPresent": true,
      "fulfillmentText": "Response configured for matched intent",
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              "Response configured for matched intent"
            ]
          }
        }
      ],
      "outputContexts": [
        {
          "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
          "lifespanCount": 5,
          "parameters": {
            "param-name": "param-value"
          }
        }
      ],
      "intent": {
        "name": "projects/project-id/agent/intents/intent-id",
        "displayName": "matched-intent-name"
      },
      "intentDetectionConfidence": 1,
      "diagnosticInfo": {},
      "languageCode": "en"
    },
    "originalDetectIntentRequest": {}
  }

const pluck = (arr) => {
  const min = 0;
  const max = arr.length - 1;
  const randomNumber = Math.floor(Math.random() * (max-min +1)) + min;
  return arr[randomNumber];

}

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body
    const intentName = body.queryResult.intent.displayName
    const params = body.queryResult.parameters


// =======================================================================================//    

switch (intentName)
{
  case "Default Welcome Intent":
  {

  const currentTime = momentTZ.tz(moment(), "Asia/Karachi");
  const currentHour =  +moment(currentTime).format('HH');
  // moment(currentTime).format('hh:mm:ss'); //Convert format
  let greeting = "";
  if (currentHour < 6) {
    greeting = "good night"
} else if (currentHour < 12) {
    greeting = "good morning"
} else if (currentHour < 15) {
    greeting = "good afternoon"
} else if (currentHour < 17) {
    greeting = "good evening"
} else {
    greeting = "good night"
}

  let responseText = pluck (
    
    [
  `${greeting} Welcome to our Pizza Store`,
   "this is alernate response from webhook server",
   "this is third response"
    ])

  console.log(responseText);

  res.send({
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            responseText
          ]
        }
      }
    ]
  })

}
    break;

// =======================================================================================//  

  case "newOrder":
    let responseText = `you said: ${params.qty} ${params.pizzaSize}
    ${params.pizzaflavours} pizza, your pizza on the way reply came from webserver`;
    console.log("collected params:", params);

  res.send({
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            responseText,
          
            // "Error Bhai"
          ]
        }
      }
    ]
  })
    break;

  default:
    res.send({
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              "Else Error Nodejs Server"
            ]
          }
        }
      ]
    })

    break;
}
  

 // =======================================================================================//    
  
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "server cerror",
    });
  }
});


// =======================================================================================//  

app.listen(PORT, () => {
  console.log(`Port run ${PORT}`);
});


