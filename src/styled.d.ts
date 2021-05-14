import 'styled-components';
import { treeGardenTheme } from './theme';

// inspiration: https://blog.agney.dev/styled-components-&-typescript/
type ThemeType = typeof treeGardenTheme;
declare module 'styled-components' {

  export interface DefaultTheme extends ThemeType { }
}
