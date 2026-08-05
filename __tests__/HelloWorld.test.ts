import { mount } from '@vue/test-utils';
import { HelloWorld } from '../src';
test('renders correctly', () => {
  const wrapper = mount(HelloWorld);
  expect(wrapper.exists()).toBe(true);
});
