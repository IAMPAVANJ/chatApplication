import React, { useEffect } from 'react';
import {Box, Toast} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../contextApi/chatProvioder';
import SideDrawer from '../../Components/miscellanious/SideDrawer';
import MyChats from '../../Components/Mychats';
import ChatBox from '../../Components/ChatBox';
import { useToast } from '@chakra-ui/react';
const ChatPage = () => {
  const [fetchAgain,setFetchAgain] = useState(false)
  const {user} = ChatState();
  const toast = useToast();
  
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box
        display='flex'
        justifyContent='space-between'
        w="100%"
        h='91.vh'
        p="10px"
      >
        
          {user && <MyChats/>}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
          )}  
      </Box>
    </div>
  )
}

export default ChatPage;
