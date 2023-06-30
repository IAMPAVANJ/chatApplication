import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    Button,
    ModalHeader,
    Image,
    Text
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />)}

            <Modal size="lg" isCentered  isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                    fontSize="40px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="space-between"
                    >
                       <Image objectFit='cover' borderRadius="full" boxSize="200px" src={user.pic} alt={user.name}/>
                       <Text
                        fontSize={{base:"28px",md:"30px"}}
                        fontFamily="Work sans"
                       >
                        Email:{user.email}
                       </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )

}
export default ProfileModal;