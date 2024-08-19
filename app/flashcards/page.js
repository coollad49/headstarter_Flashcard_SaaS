"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Container, Card, CardActionArea, CardContent, Typography, Grid } from '@mui/material'
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    useEffect(() => {
        async function getFlashcards() {
            if (!isLoaded || !isSignedIn || !user) {
                console.log("User not loaded or not signed in")
                return
            }
            const docRef = doc(collection(firestore, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            console.log(docSnap.data())
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcardSets || []
                console.log("Flashcards fetched:", collections)
                setFlashcards(collections)
            } else {
                console.log("No document found, creating a new one")
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [isLoaded, isSignedIn, user])

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Flashcards
            </Typography>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}