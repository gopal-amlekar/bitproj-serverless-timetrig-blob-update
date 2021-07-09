# Bit project serverless camp
This repo contains some sample code as part of pair programming exercises done in the mentoring sessions with my mentee.

# Cat image blob trigger

This is Week 3 pair programming exercise. It runs an Azure function periodically on a timer trigger, downloads a cat image from https://cataas.com using their API, then uploads the image to Azure blob storage with a new name.

The `TimerTrigger` makes it incredibly easy to have your functions executed on a schedule. 


## Notes:
1. Storage account key needs to be added in local.settings.json when running the function locally.
2. When in cloud, the key can be added to Function app configuration.
3. Cron timing may be confusing. Have a look at https://crontab.guru in addition to the information given towards end of this file.
4. The code in this repo also contains some commented out code to download the images locally. Use that for local debugging if needed.
5. Do not forget to disable the function after you are done. Otherwise, it can keep running and may cost your Azure storage. 
  * I was not able to disable the function in portal from the 'overview' tab. But in the functions list in main function app, click on the elipsis and then disabling the function from there worked.

## How it works (From the Azure function template in VS Code)

For a `TimerTrigger` to work, you provide a schedule in the form of a [cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression)(See the link for full details). A cron expression is a string with 6 separate expressions which represent a given schedule via patterns. The pattern we use to represent every 5 minutes is `0 */5 * * * *`. This, in plain text, means: "When seconds is equal to 0, minutes is divisible by 5, for any hour, day of the month, month, day of the week, or year".

## Learn more

