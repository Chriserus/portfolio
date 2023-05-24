import puppeteer from 'puppeteer'
import { NextResponse } from 'next/server'
//     "0xd6cdf4072eb6bcf10ef1b715aaa0fdf755b52327": {
//       "name": "SimpleQuests.sol"
//     },
//     "0x50dC3f8395eB76A1B99E9509ED52F96FCB11b037": {
//       "name": "Village.sol"
//     }
//     "0x928516345463816b76194e0d8e4b6eb0f2c9c10e": {
//       "name": "WeaponStaking.sol"
//     }
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const browser = await puppeteer.launch({
    headless: 'new',
  })

  const page = await browser.newPage()

  // const address = '0xd6cdf4072eb6bcf10ef1b715aaa0fdf755b52327'
  await page.goto(`https://bscscan.com/address/${address}`, {
    waitUntil: 'domcontentloaded',
  })

  const contract = await page.evaluate(() => {
    const numberOfTransactions = document.querySelector(
      '[data-original-title="Click to view full list"]'
    )?.textContent
    return { numberOfTransactions }
  })

  if (!contract.numberOfTransactions) {
    return NextResponse.error()
  }

  await browser.close()

  return NextResponse.json(contract)
}
