import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Divider,
    ExpandedIndex,
    HStack,
    Text,
    VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Image from 'next/image';
import { CategoryType, Response } from '@api/server';
import { SubcategoryAccordionItem } from '../SubcategoryAccordionItem';
import { useTrans } from '@hooks/useTrans';
import {env} from "../../../../env";

type CategoryAccordionItemProps = {
    categories: Response<CategoryType>;
    category: number;
    subcategory: number;
    onChangeAccordion?: () => void;
};

export function CategoryAccordionItem({
    categories,
    category,
    subcategory,
    onChangeAccordion
}: CategoryAccordionItemProps) {
    const { locale } = useTrans();
    const [index, setIndex] = useState<number>(findIndexById());

    function findIndexById() {
        return categories.results.findIndex((v) => v.id === category);
    }

    function onChangeIndex(expandedIndex: ExpandedIndex) {
        setIndex(expandedIndex as number);
    }

    return (
        <HStack spacing={'0px'}>
            <VStack
                height={{ base: 'auto', lg: 'full' }}
                minWidth={'300px'}
                width={{ base: 'full', lg: '300px' }}
            >
                <Accordion
                    allowToggle
                    index={index}
                    onChange={onChangeIndex}
                    width={'full'}
                    backgroundColor={'accordion'}
                    overflowY={'auto'}
                >
                    {categories &&
                        categories.results
                            .filter((c) => c.subcategories.length > 0)
                            .map((categoryItem, accIndex) => (
                                <AccordionItem
                                    key={categoryItem.id}
                                    backgroundColor={
                                        accIndex !== index &&
                                        category === categoryItem.id
                                            ? 'accordionSelected'
                                            : 'white'
                                    }
                                >
                                    <AccordionButton paddingStart={'0.5rem'}>
                                        <HStack>
                                            <AccordionIcon />
                                            <Image
                                                src={
                                                    env
                                                        .NEXT_PUBLIC_BACKEND_URL +
                                                    categoryItem.image
                                                }
                                                alt={'category type'}
                                                height={24}
                                                width={24}
                                            />
                                            <Box flex="1" textAlign="left">
                                                <Text fontSize={'smaller'}>
                                                    {locale === 'es'
                                                        ? categoryItem.name
                                                        : categoryItem.name_trans}
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </AccordionButton>
                                    <AccordionPanel padding={'0px'}>
                                        <VStack
                                            alignItems={'start'}
                                            spacing={'0px'}
                                        >
                                            {categoryItem.subcategories.map(
                                                (subcategoryItem) => (
                                                    <SubcategoryAccordionItem
                                                        key={subcategoryItem.id}
                                                        id={subcategoryItem.id}
                                                        index={categoryItem.id}
                                                        isSelected={
                                                            subcategory ===
                                                            subcategoryItem.id
                                                        }
                                                        onChangeAccordion={
                                                            onChangeAccordion
                                                        }
                                                        text={
                                                            locale === 'es'
                                                                ? subcategoryItem.name
                                                                : subcategoryItem.name_trans!
                                                        }
                                                    />
                                                )
                                            )}
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                </Accordion>
            </VStack>
            <Divider orientation={'vertical'} backgroundColor={'neutral.100'} />
        </HStack>
    );
}
