"use client"
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams  } from 'next/navigation'
import { collection, getDoc, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Container, Card, CardActionArea, CardContent, Typography, Grid, Box } from '@mui/material'
import { doc } from 'firebase/firestore'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    console.log(flashcards)
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    console.log(search)
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }
  
    useEffect(() => {
      async function getFlashcard() {
        if (!search || !user) return;
        
        const docRef = doc(collection(firestore, 'users'), user.id, 'flashcardSets', search);
        
        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const docs = docSnapshot.data().flashcards || [];  // Assuming flashcards is an array of objects
                    
                    const flashcards = docs.map((flashcard, index) => ({
                        id: index,  // Assigning an index as ID since it's an array
                        ...flashcard,
                    }));
    
                    setFlashcards(flashcards);
                    console.log(flashcards);  // This will contain the value of the "flashcards" field
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
        }
    
        getFlashcard();
    
      }, [search, user])
    
      return (
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            {`${search} Flashcards`}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box className={`flashcard ${flipped[flashcard.id] ? 'flipped' : ''}`}>
                        <div className="flashcard-inner">
                          <div className="flashcard-front">
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div className="flashcard-back">
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
  }