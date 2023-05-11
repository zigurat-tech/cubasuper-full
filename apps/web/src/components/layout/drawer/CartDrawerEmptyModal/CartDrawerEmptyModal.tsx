import { DeleteIcon } from '@chakra-ui/icons';
import {
    Button,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import { useCart } from '@store/models/cartDrawer';
import { useTrans } from '@hooks/useTrans';

export function CartDrawerEmptyModal() {
    const { emptyCart, onCloseCart } = useCart();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTrans();

    function onClickEmptyButton() {
        emptyCart();
        onCloseCart();
    }

    return (
        <>
            <Button
                variant={'ghost'}
                aria-label={'Empty Cart Button'}
                rightIcon={<DeleteIcon />}
                padding={'0.5rem'}
                onClick={onOpen}
            >
                {t('cart.empty')}
            </Button>
            <Modal size={'sm'} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent padding={'3rem 1rem 1rem'}>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Heading fontSize={'2xl'}>
                                {t('cart.empty_title')}
                            </Heading>
                            <Text> {t('cart.empty_question')}</Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack width={'full'}>
                            <Button
                                borderRadius={'0.25rem'}
                                variant={'primarySolid'}
                                onClick={onClose}
                                width={'full'}
                            >
                                {t('cart.empty_cancel')}
                            </Button>
                            <Button
                                width={'full'}
                                borderRadius={'0.25rem'}
                                variant={'error'}
                                onClick={onClickEmptyButton}
                            >
                                {t('cart.empty_accept')}
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
