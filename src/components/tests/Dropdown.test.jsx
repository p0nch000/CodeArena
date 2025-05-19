// Dropdown.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../Dropdown';

describe('Dropdown component', () => {
  const options = ['apple', 'banana', 'cherry'];

  it('renders the label correctly', () => {
    render(<Dropdown label="Fruit" options={options} value="apple" onChange={() => {}} />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('renders all options with capitalized text', () => {
    render(<Dropdown options={options} value="banana" onChange={() => {}} />);
    const optionElements = screen.getAllByRole('option');
    expect(optionElements).toHaveLength(3);
    expect(optionElements[0].textContent).toBe('Apple');
    expect(optionElements[1].textContent).toBe('Banana');
    expect(optionElements[2].textContent).toBe('Cherry');
  });

  it('calls onChange with the selected value when changed', () => {
    const handleChange = jest.fn();
    render(<Dropdown options={options} value="apple" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'banana' } });
    expect(handleChange).toHaveBeenCalledWith('banana');
  });
});
