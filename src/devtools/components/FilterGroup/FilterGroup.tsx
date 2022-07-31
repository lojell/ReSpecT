import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FilterItem, Container, SpecialFilterItem, LabelItem, RegularFilterContainer } from './styles';

type ItemType = string

interface ButtonGroupProps<T extends ItemType> {
  items: T[]
  activeItems?: T[]
  onChange: (activeItems: T[]) => void;
  filterButton?: { title: string, pattert: RegExp }
  noFilterTitle: string;
}

function FilterGroup<T extends ItemType>({ items, activeItems = [], noFilterTitle, filterButton, onChange: onChange }: ButtonGroupProps<T>) {

  const [itemsState, setItemsState] = useState(items);
  const [activeItemsState, setActiveItemsState] = useState(activeItems);
  const [filterButtonChecked, setFilterButtonChecked] = useState(false);

  const filterScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    filterScrollRef.current.addEventListener('wheel', (e) =>
      filterScrollRef.current.scrollLeft += Math.round(e.deltaY / 2)
    )
  }, []);

  useEffect(() => {
    setItemsState(items);
    if (filterButton?.pattert) {
      setActiveItemsState(prevActives => {
        if (!items.length) {
          return [];
        } else {
          const byFilterButtonPattern = items.filter(x => filterButton?.pattert.test(x)) || [];
          const newActives = filterButtonChecked
            ? (byFilterButtonPattern.length ? [...byFilterButtonPattern] : ['none' as T])
            : prevActives;
          //: [...prevActives.filter(x => !byFilterButtonPattern.includes(x))];

          onChange(newActives);
          return newActives;
        }
      })
    }

  }, [JSON.stringify(items), filterButton, filterButtonChecked]);

  useEffect(() => {
    setActiveItemsState(activeItems);
  }, [activeItems]);

  const handleItemClick = useCallback((item?) => {
    setFilterButtonChecked(false);
    setActiveItemsState(prevActives => {
      const newActives = filterButtonChecked && item
        ? [item]
        : item
          ? prevActives.includes(item)
            ? [...prevActives.filter(x => x !== item)]
            : [...prevActives, item]
          : [];

      onChange(newActives);
      return newActives;
    })

  }, [itemsState, activeItemsState, filterButtonChecked]);

  return (
    <Container>
      <SpecialFilterItem onClick={() => handleItemClick()} active={!filterButtonChecked && !activeItemsState.length}>{noFilterTitle}</SpecialFilterItem>
      <LabelItem>:</LabelItem>
      <SpecialFilterItem onClick={() => setFilterButtonChecked(checked => !checked)} active={filterButtonChecked}>{filterButton.title}</SpecialFilterItem>
      {!!itemsState.length && <LabelItem>:</LabelItem>}
      <RegularFilterContainer ref={filterScrollRef} onScroll={(e) => console.log(e)}>
        {
          itemsState.map(item =>
            <FilterItem key={item} onClick={() => handleItemClick(item)} active={activeItemsState.includes(item)} special={filterButtonChecked}>{item.split('://')[1]}</FilterItem>
          )
        }
      </RegularFilterContainer>
    </Container>
  );

}

export default FilterGroup;
