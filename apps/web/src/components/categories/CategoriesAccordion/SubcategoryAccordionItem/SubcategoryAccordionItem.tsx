import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import React from 'react';

type SubCategoryButtonProps = {
    text: string;
    isSelected: boolean;
    index: number;
    id: number;
    onChangeAccordion?: () => void;
};

export function SubcategoryAccordionItem({
    text,
    isSelected,
    index,
    id,
    onChangeAccordion
}: SubCategoryButtonProps) {
    const router = useRouter();

    async function onClickSubCategory() {
        await router.push(
            `/categories/${index}/${id}`,
            `/categories/${index}/${id}`,
            { locale: router.locale }
        );
        if (onChangeAccordion) {
            onChangeAccordion();
        }
    }

    return (
        <Box
            borderTop={'1px solid'}
            borderColor={'neutral.100'}
            cursor={'pointer'}
            padding={'0.5rem 2rem 0.5rem 4rem'}
            width={'full'}
            display={'flex'}
            _hover={{
                backgroundColor: 'accordionSelected'
            }}
            fontWeight={400}
            backgroundColor={isSelected ? 'accordionSelected' : 'white'}
            onClick={onClickSubCategory}
        >
            {text}
        </Box>
    );
}
