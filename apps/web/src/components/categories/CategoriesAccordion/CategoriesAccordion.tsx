import React, { useState } from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    ExpandedIndex,
    useMediaQuery
} from '@chakra-ui/react';
import { CategoryAccordionItem } from '@components/categories';
import { api } from '@api/server';
import { useTrans } from '@hooks/useTrans';

type CategoriesAccordionProps = {
    category: number;
    subcategory: number;
};

export function CategoriesAccordion({
    category,
    subcategory
}: CategoriesAccordionProps) {
    const { t } = useTrans();
    const [isOpen, setIsOpen] = useState<number>(0);
    const { data: categories } = api.useQuery('/backend/v1/category/');

    const [isLargerThan1024] = useMediaQuery('(min-width: 992px)', {
        ssr: true,
        fallback: true
    });

    function onToggleOpen(expandedIndex: ExpandedIndex) {
        setIsOpen(expandedIndex as number);
    }

    function onClose() {
        setIsOpen(-1);
    }

    return (
        <React.Fragment>
            {categories && (
                <React.Fragment>
                    {isLargerThan1024 ? (
                        <CategoryAccordionItem
                            categories={categories}
                            category={category}
                            subcategory={subcategory}
                            onChangeAccordion={onClose}
                        />
                    ) : (
                        <Accordion
                            width={'full'}
                            allowToggle={true}
                            index={isOpen}
                            onChange={onToggleOpen}
                        >
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            {t('categories.title')}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel padding={'0px'}>
                                    <CategoryAccordionItem
                                        categories={categories}
                                        category={category}
                                        subcategory={subcategory}
                                        onChangeAccordion={onClose}
                                    />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
