import { COLORS } from '@/constants/colors';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropTypes = {
  children: React.ReactNode;
};

const SafeScreen = ({ children }: PropTypes) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background }}>
      {children}
    </View>
  );
};

export default SafeScreen;
