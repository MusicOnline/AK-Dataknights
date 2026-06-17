import { bundleArkdataImages } from "./bundle-arkdata-images"

bundleArkdataImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
