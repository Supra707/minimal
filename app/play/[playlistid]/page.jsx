'use client'
import React, { useEffect } from 'react'
import PlayerLayout from '@/app/components/player-layout'
import { useParams } from 'next/navigation';
const page = () => {
  const params=useParams();
 
  return (
    <div>
        <PlayerLayout playlistId={params.playlistid} />
      </div>
  )
}

export default page