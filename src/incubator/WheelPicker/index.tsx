// TODO: Support onChange callback
// TODO: Support style customization
// TODO: Support control of visible items
import _ from 'lodash';
import React, {useCallback, useRef} from 'react';
import {TextStyle, FlatList, StyleProp} from 'react-native';
import Animated from 'react-native-reanimated';
import {onScrollEvent, useValues} from 'react-native-redash';

import View from '../../components/view';
import {Constants} from '../../helpers';

import Item, {ItemProps} from './Item';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export interface WheelPickerProps {
  items?: ItemProps[];
  itemHeight?: number;
  itemTextStyle?: StyleProp<TextStyle>;
  onChange: (item: ItemProps, index: number) => void;
}

const WheelPicker = ({items, itemHeight = 48, itemTextStyle}: WheelPickerProps) => {
  const height = itemHeight * 4;
  const scrollview = useRef<Animated.ScrollView>();
  const [offset] = useValues([0], []);
  const onScroll = onScrollEvent({y: offset});

  const selectItem = useCallback(
    index => {
      if (scrollview.current) {
        scrollview.current.getNode().scrollTo({y: index * itemHeight, animated: true});
      }
    },
    [itemHeight]
  );

  const onChange = useCallback(() => {
    // TODO: need to implement on change event that calc the current selected index
  }, [itemHeight]);

  const renderItem = useCallback(({item, index}) => {
    return (
      <Item
        index={index}
        itemHeight={itemHeight}
        offset={offset}
        textStyle={itemTextStyle}
        {...item}
        onSelect={selectItem}
      />
    );
  }, []);

  return (
    <View>
      <View width={250} height={height} br20>
        <AnimatedFlatList
          data={items}
          keyExtractor={keyExtractor}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onMomentumScrollEnd={onChange}
          showsVerticalScrollIndicator={false}
          // @ts-ignore
          ref={scrollview}
          contentContainerStyle={{
            paddingVertical: height / 2 - itemHeight / 2
          }}
          snapToInterval={itemHeight}
          decelerationRate={Constants.isAndroid ? 0.98 : 'normal'}
          renderItem={renderItem}
        />
        <View absF centerV pointerEvents="none">
          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              height: itemHeight
            }}
          />
        </View>
      </View>
    </View>
  );
};

const keyExtractor = (item: ItemProps) => item.value;

export default WheelPicker;
