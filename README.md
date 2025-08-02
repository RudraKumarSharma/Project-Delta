# Project-Delta CLI

Project-Delta simplifies tracking your progress across multiple coding platforms by aggregating all your stats into a single, convenient command-line interface.

## Features

-   **User Authentication:** Securely log in to your Project-Delta account.
-   **Account Management:** View and manage your connected accounts from various coding platforms.
-   **Profile Status:** Check your profile status and progress.
-   **Recent Submissions:** View your recent submissions on connected platforms.
-   **Interactive UI:** A user-friendly and interactive command-line interface.

## Prerequisites

-   [Node.js](https://nodejs.org/) installed on your system.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/RudraKumarSharma/Project-Delta.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Project-Delta
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```

## Obtaining Credentials

To connect your coding platform accounts, you will need to provide specific authentication tokens.

### Important Security Notice

Your session tokens and cookies are highly sensitive credentials. **Treat them like passwords.** Anyone with access to them can take over your account.

-   **NEVER** share them with anyone you do not trust completely.
-   **DO NOT** commit them to any public Git repository.
-   Be aware of the security risks involved.

### How to Find Your Credentials

The general process involves using your web browser's developer tools to inspect the cookies for each site.

1.  Log in to the website (e.g., LeetCode or GeeksforGeeks).
2.  Open the developer tools by right-clicking on the page and selecting **Inspect** or by pressing `F12` (`Cmd+Option+I` on macOS).
3.  Navigate to the **Application** tab (in Chrome/Edge) or the **Storage** tab (in Firefox).
4.  In the left-hand menu, expand the **Cookies** section and select the website's domain (e.g., `https://leetcode.com`).

#### LeetCode

You will need to find two values:

-   `LEETCODE_SESSION`: Your main session token.


Copy the value of this from the "Value" column in the cookie list.

#### GeeksforGeeks (GFG)

You are looking for the `cookie`. Find it in the list and copy its value.

## Usage

To start the CLI, run the following command:

```bash
node index.js
```

This will launch the interactive CLI, which will guide you through the available options.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License.

