import React from "react";

export default function test() {
  const paymentStart = () => {
    console.log("payment started");
    console.log(cart.totalPrice);
    if (
      cart.totalPrice == "" ||
      cart.totalPrice == null ||
      cart.totalPrice < 1
    ) {
      alert("amount is required");
      return;
    } else {
      PaymentService.createOrder(cart.totalPrice)
        .then((response) => {
          console.log(response.data);
          if (response.data.status == "created") {
            // console.log("ok to proceed");
            let options = {
              key: "rzp_test_HaL1kKdoP2U7pw",
              amount: response.data.amount,
              currency: "INR",
              name: "E Shopping Zone",
              description: "Online Payment",
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACCCAMAAAADi7iSAAAAbFBMVEX5+fkoKCj///8AAAD8/PwlJSUgICAcHBwVFRXz8/Pl5eUSEhLw8PDp6ent7e16enrV1dWKiopgYGDAwMCzs7Pc3Nw2NjYJCQmXl5elpaXGxsZPT089PT26urpFRUWenp4vLy9paWlXV1dycnJ97W3LAAAEVElEQVR4nO2ayXbiOhCGUWm0jUc8YDPb7/+OXbI8QaDP6c2lcq6+TaRk86eoWex2Ho/H4/F4PB6Px+PxeDwej8dDECG+reAfEHHye+SK3SknrTbYfvaQR7yEzf2/1/NXRPIIF01w4UzKbL1nafAdWZ+As7yAM6+otGRMXwN3Bbhxan4BaWPS/WjOoDcM4el4g7CIopaYL0DJGT9nYjxqFCuVu1yUYaojplZUnDFzceY8KTzn7nxEH2YxMU8QiZbyXo2qMCWgWpcUoEO1NTHTWm9V8p45talZ1R440wU5tTuUaG5WltidbU4YnPJBs+ZITi3cIoysAwgIchtlDBMBVowWz/xAT+3FauR9np85G+GnPL/aMw+JBZlNChj76ABRpNiEcmdZJ98W94qA5C7ZW/Tj2+JegTg/fRCLmZeYI0DLo09iGbW6iwXro1ZGre6iZT9rxdgjlRJEpRbLSqWeLzYlUBK72z30LI/LvuhVM13uxaM3Ea26a/uWyUHNsdoH+yq3aVarNgzshZOqu+I6lQN9rcbpQUBVq6jYT5dDR8gToIwmN7hXsxEh09d4vlDRKgC5NFNU8U2igpZcIyPCLrukcwrQ/ZMRiQ25iOg5n9MBi0pq1nxB7Ace6cVr0bbY0W4tjDdB53/A6D+mk9oryty3h64K1q1HknWH8psCXxAYZS7XnlBkcOVRfZqjDcori/iDjnF3IpiiTNmKBWWD5ZbtR2/AmV1iQaPUJEBppjrWjzbEuOPRNPmWeKa1UxKpmf3WDeRJDOk0m+PPMCDkB+MWYVJ7dvtlTALdzakdKiC2Ik/quT9ce+7kNu1ASNnVkpxntdFtFhdUMJKRU7t4AlP1XGxF0g59kVJKtBNLlE1djS1dOPgYrSOOxY2Y3y4ZDI17tbWtRAuLAitGc0SxcUemYbSIcNnM2K3iRaFGdIWh4UerE4oioeS942Z5Hhpb7ja4AtJ22d5S2jTDrVlncSPPwbQHdWpFyE1KSK3ItrsEeXa/hX4aHfec8YqOXLTeVm1tOxosZ1zFdoi0f6W0axZxs1HLdAsgwpy3OS9jnNswwY29JBHGt5yNcVl+HPi5A1FylR4HzUi9kdh3sie5mj9CsDUCslMzPpydCaktrCK9WTEu79GQm2WqoAFk9rNu0nrjug8YX3YgdP2ZIdSLDdxwjPpCb+SmGXZgweVknm39feJhyA8BPHuvNloqY1yRkxGdYjYul2z7Ip+X4+vVDN/W+BNxNOw9mtYef0TE6v3Lg6G0T1iw3055g9SU9gkrIm/eqI0INQlPwPBTLvZkJE1rNwnDD2fgxB72NuDE8GJdKSl/5U7kq3VrLG+aYK7dAMfZuqroIroxNgHzfoF3kPKGrtuOiJ17PdM9HvN120QUVyWksUswqDLCQWYRCZZg2bgukdhi6Q3BSTWK3NveJ/b1PY1/i9hdUCZA3gFWfpNWj8fj8Xg8Ho/H4/F4PB6Px/N/4g/mfS7InoB3PwAAAABJRU5ErkJggg==",
              order_id: response.data.id,
              handler: function (response) {
                console.log(response);
                console.log("payment successful");
                alert("congrats !! Payment successful !!");
              },
              prefill: {
                name: "",
                email: "",
                contact: "",
              },

              notes: {
                address: "Case Study With Anirban",
              },

              theme: {
                color: "#3399cc",
              },
            };

            let rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response) {
              console.log(response);
              // console(response.error.code);
              // console(response.error.description);
              // console(response.error.source);
              // console(response.error.step);
              // console(response.error.reason);
              // console(response.error.metadata.order_id);
              // console(response.error.metadata.payment_id);
              alert("Oops payment failed");
            });

            rzp.open();
          }
          // console.log(response.data.status);
        })
        .catch((err) => {
          // setErrorMessage('Unexpected error occurred');
          console.log(err);
          alert("something went wrong");
        });
    }
  };
  return <div></div>;
}
