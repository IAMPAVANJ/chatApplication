import { CloseIcon } from "@chakra-ui/icons";
import { Box} from "@chakra-ui/react";
import React from "react";
const UserBadgeItem = ({user,handleDelete})=>{
    return(
        <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        display="flex"
        alignItems="center"
        flexDir="row"
        variant="solid"
        fontSize={12}
        backgroundColor="purple"
        color='white'
        cursor="pointer"
        onClick={handleDelete}
        >
            {user.name}
            <CloseIcon  pl={1}/>
        </Box>
    )
}
export default UserBadgeItem;