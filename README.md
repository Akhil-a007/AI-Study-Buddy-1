# AI Study Buddy

An AI-powered application that generates a multiple-choice quiz from any block of study text. It uses Gemini to extract key terms and create relevant questions to help you test your knowledge.

This project is bootstrapped with Vite and is ready for deployment on Netlify.

## Setup and Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Google Gemini API key:
    ```
    API_KEY=YOUR_API_KEY_HERE
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on a local development server, usually `http://localhost:5173`.

## Building for Production

To create a production-ready build of the application:
```bash
npm run build
```
This command bundles the application into the `dist` directory.

## Deployment to Netlify

This repository is configured for easy deployment to Netlify.

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Connect your repository to a new site on Netlify.
3.  Netlify will automatically detect the `netlify.toml` file and use the following settings:
    -   **Build command:** `npm run build`
    -   **Publish directory:** `dist`
4.  You **must** set the `API_KEY` environment variable in your Netlify site's settings:
    -   Go to **Site settings > Build & deploy > Environment**.
    -   Add a new environment variable:
        -   **Key:** `API_KEY`
        -   **Value:** `YOUR_API_KEY_HERE`

Netlify will then build and deploy your site.
