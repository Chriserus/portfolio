'use client'
import { useState } from 'react'
import contractsInfo from '@/app/data/contracts.json'
import { Chains } from '@/app/interfaces/chains'
import { Contract } from '@/app/interfaces/contract'
import { ContractsInfo } from '@/app/interfaces/contractsInfo'

export default function Home() {
  const [chain, setChain] = useState<Chains | undefined>(undefined)
  const [address, setAddress] = useState('')
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const [error, setError] = useState('')
  const getNumberOfTransactions = async () => {
    if (!chain || !address) return
    const response = await fetch(
      `http://localhost:3000/smart-contracts/api?address=${address}&chain=${chain}`
    )
    if (!response.ok) {
      setContract(undefined)
      setError(response.statusText)
      return
    }
    const { numberOfTransactions } = await response.json()
    setContract({
      name: (contractsInfo as ContractsInfo).contracts[chain][address]?.name,
      address,
      numberOfTransactions,
    })
    setError('')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello from smart-contracts
      <div className="flex flex-col gap-5 w-full">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as Chains)}
          className="rounded-md border-2 border-gray-300 p-2 text-black"
        >
          <option disabled value={undefined}>
            Select a chain
          </option>
          {Object.values(Chains).map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ))}
        </select>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          className="rounded-md border-2 border-gray-300 p-2 text-black"
          placeholder="Enter contract address"
        />
        <button
          onClick={getNumberOfTransactions}
          disabled={!chain || !address}
          type="button"
          className="rounded-md bg-pink-600 p-5 text-xl"
        >
          Get data
        </button>
        {contract?.numberOfTransactions && (
          <p>
            {contract.name ? (
              <span>{contract.name} </span>
            ) : (
              <span>This contract </span>
            )}
            on {chain} has{' '}
            <span className="text-green-500">
              {contract.numberOfTransactions}{' '}
            </span>
            transactions
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
  )
}
