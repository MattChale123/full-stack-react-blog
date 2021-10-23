import React from 'react'
import useOnlineStatus from './useOnlineStatus'

export default function OnlineStatus() {
    const online = useOnlineStatus()

    return <div>{online.toString()}</div>
}
