import { EmojiData, Picker } from "emoji-mart"
import { FunctionComponent, useContext, useState } from "react"
import { Button, Form, Input } from "semantic-ui-react"
import { FormContext, MyFormProps } from "../pages/create"
import styles from './PollForm.module.css'

type PollFormProps = {
    createPoll: (body: MyFormProps) => {}
    className?: string
}

const PollForm: FunctionComponent<PollFormProps> = ({ createPoll, className }) => {
    const { loading } = useContext(FormContext)

    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState<boolean | string>(false)
    const [author, setAuthor] = useState('')
    const [description, setDescription] = useState('')
    const [firstOption, setFirstOption] = useState('')
    const [firstOptionError, setFirstOptionError] = useState<boolean | string>(false)
    const [secondOption, setSecondOption] = useState('')
    const [secondOptionError, setSecondOptionError] = useState<boolean | string>(false)
    const [firstEmoji, setFirstEmoji] = useState('1️⃣')
    const [secondEmoji, setSecondEmoji] = useState('2️⃣')
    const [focus, setFocus] = useState('')

    const body = {
        path: '',
        title: title,
        author: author,
        description: description,
        firstOption: firstOption,
        firstEmoji: firstEmoji,
        secondOption: secondOption,
        secondEmoji: secondEmoji
    }

    const handleSubmit = () => {
        if (!validateInput()) {
            console.log('invalid input')
            console.log(body)
            return
        }

        let path = title.toLowerCase()
        path = path.replace(/\s+/g, '-')
        path = path.replace(/[^a-zA-Z0-9-]/g, "")
        body.path = path
        createPoll(body)
    }

    const validateInput = () => {
        if (!body.title) {
            setTitleError('Title is required!')
            return false
        } else {
            setTitleError(false)
        }

        if (!body.firstOption) {
            setFirstOptionError('Option one description is required!')
            return false
        } else {
            setFirstOptionError(false)
        }

        if (!body.secondOption) {
            setSecondOptionError('Option two description is required!')
            return false
        } else {
            setSecondOptionError(false)
        }

        return true
    }

    const handleEmojiSelect = (emoji: EmojiData) => {
        const { native } = emoji as any
        if (focus === "firstEmoji") {
            setFirstEmoji(native)
        } else if (focus === "secondEmoji") {
            setSecondEmoji(native)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        if (focus === '') {
            setFocus(event.currentTarget.htmlFor)
        } else {
            setFocus('')
        }
    }

    return (
        <Form
            className={className}
            size='large'
            onSubmit={handleSubmit}
            loading={loading}
        >
            <Form.Field
                required
                id='title'
                label='Title'
                control={Input}
                error={titleError}
            >
                <Form.Input 
                    onChange={(_e, { value}) => setTitle(value)}
                    placeholder='My awesome poll!'
                />
            </Form.Field>
            <Form.Field
                id='author'
                label='Author'
                control={Input}
            >
                <Form.Input 
                    onChange={(_e, { value }) => setAuthor(value)} 
                    placeholder='John Doe' 
                />
            </Form.Field>
            <Form.Field
                id='description'
                label='Description'
                control={Input}
            >
                <Form.Input 
                    onChange={(_e, { value }) => setDescription(value)} 
                    placeholder='This is my poll!' 
                />
            </Form.Field>
            <Form.Field 
                required
                id='firstOption'
                label='Option One'
                control={Input}
                error={firstOptionError}
            >
                <Form.Input 
                    onChange={(_e, { value }) => setFirstOption(value)} 
                    placeholder='Cats!' 
                />
                <label className={styles.emoji} onClick={handleClick} htmlFor="firstEmoji">{firstEmoji}</label>
                {focus === "firstEmoji" && <Picker onClick={handleEmojiSelect} set="apple" showPreview={false} showSkinTones={false} />}
            </Form.Field>
            <Form.Field
                required
                id='secondOption'
                label='Option Two'
                control={Input}
                error={secondOptionError}
            >
                <Form.Input 
                    onChange={(_e, { value }) => setSecondOption(value)} 
                    placeholder='Dogs!' 
                />
                <label className={styles.emoji} onClick={handleClick} htmlFor="secondEmoji">{secondEmoji}</label>
                {focus === "secondEmoji" && <Picker onClick={handleEmojiSelect} set="apple" showPreview={false} showSkinTones={false} />}
            </Form.Field>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

export default PollForm