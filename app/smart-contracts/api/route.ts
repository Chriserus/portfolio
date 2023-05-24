import puppeteer from 'puppeteer'
import { NextResponse } from 'next/server'
import { Chains } from '@/app/interfaces/chains'
//     "0x928516345463816b76194e0d8e4b6eb0f2c9c10e": {
//       "name": "WeaponStaking.sol"
//     }
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chain = searchParams.get('chain')
  const browser = await puppeteer.launch({
    headless: 'new',
  })

  const page = await browser.newPage()

  let blockchainScannerUrl = ''
  switch (chain) {
    case Chains.POLYGON:
      blockchainScannerUrl = `https://polygonscan.com/address/${address}`
      break
    case Chains.BSC:
      blockchainScannerUrl = `https://bscscan.com/address/${address}`
      break
  }

  await page.goto(blockchainScannerUrl, {
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
