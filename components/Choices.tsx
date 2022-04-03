import React, { useState, FunctionComponent, useEffect } from 'react';

type Option = {
    description: string,
    emoji: string,
    votes: number
}

type ChoicesProps = {
    firstOption: Option,
    secondOption: Option,
    title: string | string[] | undefined
}

const database = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

const Choices: FunctionComponent<ChoicesProps> = ({ firstOption, secondOption, title }) => {
    const [firstOptionVotes, setFirstOptionVotes] = useState(firstOption.votes)
    const [secondOptionVotes, setSecondOptionVotes] = useState(secondOption.votes)
    const [choice, setChoice] = useState(0)

    const castVote = async (event: React.MouseEvent<HTMLButtonElement>, option: number) => {
        event.preventDefault()
        let [path, vote] = (option === 1) ? ['firstOption', firstOptionVotes] : ['secondOption', secondOptionVotes]
        await fetch(`${database}polls/${title}/${path}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ votes: vote + 1 })
        })
        setChoice(option)
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${database}polls/${title}.json`)
            return res.json()
        }

        fetchData().then(data => {
            setFirstOptionVotes(data.firstOption.votes)
            setSecondOptionVotes(data.secondOption.votes)
        })
    }, [choice])

    return(
        <div>
            <button 
                key={1} 
                disabled={choice === 1}
                onClick={(e) => castVote(e, 1)}
            >
                <p>{firstOption.description}, {firstOption.emoji}, {firstOptionVotes}</p>
            </button>
            <button 
                key={2} 
                onClick={(e) => castVote(e, 2)}
                disabled={choice === 2}
            >
                <p>{secondOption.description}, {secondOption.emoji}, {secondOptionVotes}</p>
            </button>
        </div>
    )
}

export default Choices