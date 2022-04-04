import React, { useState, FunctionComponent, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '../firebase/clientApp'
import styles from './styles/Choices.module.css'

type Option = {
    description: string,
    emoji: string,
    votes: number
}

type ChoicesProps = {
    firstOption: Option,
    secondOption: Option,
    path: string | string[] | undefined
}

const Choices: FunctionComponent<ChoicesProps> = ({ firstOption, secondOption, path }) => {
    const [firstOptionVotes, setFirstOptionVotes] = useState(firstOption.votes)
    const [secondOptionVotes, setSecondOptionVotes] = useState(secondOption.votes)
    const [choice, setChoice] = useState(0)

    const castVote = async (event: React.MouseEvent<HTMLButtonElement>, option: number) => {
        event.preventDefault()
        let route = (option === 1) ? 'firstOption' : 'secondOption'
        const body = {
            path: path,
            route: route
        }
        await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
    }

    useEffect(() => {
        const firstRef = ref(database, `polls/${path}/firstOption/votes`)
        const secondRef = ref(database, `polls/${path}/secondOption/votes`)

        onValue(firstRef, (snapshot) => {
            const data = snapshot.val();
            setFirstOptionVotes(data)
        })

        onValue(secondRef, (snapshot) => {
            const data = snapshot.val();
            setSecondOptionVotes(data)
        })
    }, [])

    return(
        <div>
            <button 
                className="left"
                key={1} 
                // disabled={choice === 1}
                onClick={(e) => castVote(e, 1)}
            >
                <p>{firstOption.description}, {firstOption.emoji}, {firstOptionVotes}</p>
            </button>
            <button
                className="right"
                key={2} 
                onClick={(e) => castVote(e, 2)}
                // disabled={choice === 2}
            >
                <p>{secondOption.description}, {secondOption.emoji}, {secondOptionVotes}</p>
            </button>
        </div>
    )
}

export default Choices