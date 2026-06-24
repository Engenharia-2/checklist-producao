import { colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 120,
    marginVertical: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginRight: 12,
  },
  logoText: {
    fontSize: 60,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  buttonWrapper: {
    width: '100%',
    height: '8%',
    marginBottom: 16,
  },
});
