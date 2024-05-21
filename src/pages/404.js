import React from 'react'
import styles from '../styles/pageNotFound.module.css'
import Link from 'next/link'
import { Card, CardContent } from '@mui/material'

const Page = () => {
    return (
        <div className={styles.Page}>
            <Card className={styles.text}>
                <CardContent>
                <h1>
                    Oops page not found 
                </h1>
                <p style={{ fontSize: '18px' }}>Oops! The page you are looking for does not exist.</p>
                <p style={{ fontSize: '18px' }}>Please go back to the <Link href="/">home page</Link>.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page