import { chakra, shouldForwardProp } from '@chakra-ui/react';
import { isValidMotionProp, motion } from 'framer-motion';

export const FramerBox = chakra(motion.div, {
    shouldForwardProp: (prop) =>
        isValidMotionProp(prop) || shouldForwardProp(prop)
});
