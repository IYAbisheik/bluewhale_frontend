import React from "react";
import {
    render,
    screen,
    fireEvent,
} from "@testing-library/react";
import Counter from "../utils/Counter";

describe("Counter Component", () => {
    test("renders initial count", () => {
        render(<Counter />);

        expect(
            screen.getByTestId("count")
        ).toHaveTextContent("0");
    });

    test("increments count", () => {
        render(<Counter />);

        const incrementBtn =
            screen.getByText("Increment");

        fireEvent.click(incrementBtn);

        expect(
            screen.getByTestId("count")
        ).toHaveTextContent("1");
    });

    test("decrements count", () => {
        render(<Counter />);

        const decrementBtn =
            screen.getByText("Decrement");

        fireEvent.click(decrementBtn);

        expect(
            screen.getByTestId("count")
        ).toHaveTextContent("-1");
    });
});