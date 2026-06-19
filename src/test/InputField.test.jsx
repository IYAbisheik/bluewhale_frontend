import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "../utils/utils";

const MockIcon = ({ size }) => (
    <svg
        data-testid="left-icon"
        width={size}
        height={size}
    />
);

describe("InputField Component", () => {
    const defaultProps = {
        icon: MockIcon,
        name: "email",
        value: "",
        placeholder: "Enter email",
        onChange: jest.fn(),
        focusedField: "",
        setFocusedField: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders input field", () => {
        render(<InputField {...defaultProps} />);

        expect(
            screen.getByPlaceholderText("Enter email")
        ).toBeInTheDocument();
    });

    test("renders input value", () => {
        render(
            <InputField
                {...defaultProps}
                value="test@gmail.com"
            />
        );

        expect(
            screen.getByDisplayValue("test@gmail.com")
        ).toBeInTheDocument();
    });

    test("calls onChange when typing", () => {
        const handleChange = jest.fn();

        render(
            <InputField
                {...defaultProps}
                onChange={handleChange}
            />
        );

        const input =
            screen.getByPlaceholderText("Enter email");

        fireEvent.change(input, {
            target: {
                value: "hello@gmail.com",
            },
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test("calls setFocusedField on focus", () => {
        const setFocusedField = jest.fn();

        render(
            <InputField
                {...defaultProps}
                setFocusedField={setFocusedField}
            />
        );

        const input =
            screen.getByPlaceholderText("Enter email");

        fireEvent.focus(input);

        expect(setFocusedField).toHaveBeenCalledWith(
            "email"
        );
    });

    test("calls setFocusedField with empty string on blur", () => {
        const setFocusedField = jest.fn();

        render(
            <InputField
                {...defaultProps}
                setFocusedField={setFocusedField}
            />
        );

        const input =
            screen.getByPlaceholderText("Enter email");

        fireEvent.blur(input);

        expect(setFocusedField).toHaveBeenCalledWith(
            ""
        );
    });

    test("renders end icon when provided", () => {
        render(
            <InputField
                {...defaultProps}
                endIcon={
                    <span data-testid="end-icon">
                        Show
                    </span>
                }
            />
        );

        expect(
            screen.getByTestId("end-icon")
        ).toBeInTheDocument();
    });

    test("renders left icon", () => {
        render(<InputField {...defaultProps} />);

        expect(
            screen.getByTestId("left-icon")
        ).toBeInTheDocument();
    });
});