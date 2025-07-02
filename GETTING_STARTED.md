# Getting Started with the Design System MCP Server

This guide will help you set up the Design System MCP Server to work with Amazon Q chat. This tool allows you to query design system components, patterns, and layouts directly through conversational AI.

## What You'll Need

- Access to our AWS account
- VS Code (recommended)
- Node.js installed on your machine

### More on Node.js

Check if it's installed by opening the Terminal app and running this command to see the version: `node -v`.

If you get a "command not found" message, go to the [Node.js download page](https://nodejs.org/en/download) to get it. You can use the selection tool to run the installation from the command line or the download the binary and run it from your machine.

Pick the current LTS (long-term support) version of Node.

The command line tool will have you pick a node version manager and node package manager. Unless you have a preference for something else, use `nvm` and `npm`.

## Step 1: Install Amazon Q Chat

> [!IMPORTANT]
> During installation, sign in with the `Use with Pro license` option.

1. Visit the Amazon Q chat installation page using this start URL: [Amazon Q Developer](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-installing.html?b=cli&p=overview&s=tiles) (Command Line)
    - We want to use the command line version (CLI) because it's more reliable and has access to the MCP tools.
3. Click "Get Started" and follow the installation instructions for your operating system
4. Once installed, you can access Amazon Q through the terminal command line by typing `q chat`
    - Once you start Q, we recommend switching the model to Claude 4 by typing `/model` and choosing that option.

## Step 2: Download This Project

You have two options to get the project files:

### Option A: Download ZIP (Easier)
1. Go to the project's GitHub page
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your Desktop or preferred location
   - It will download and extract as `design-system-server-main`. You can remove the `-main` or leave as is but the rest of the instructions assume it's not there.

### Option B: Clone with Git (If you're comfortable with Git)
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to where you want the project, e.g., `~/repo/`
3. Run: `git clone [repository-url]`

## Step 3: Install the Project

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to the project folder, for example:
   ```
   cd Desktop/design-system-server
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```

## Step 4: Set Up GitHub Access

The MCP server needs API access to GitHub to fetch the design system documentation. You'll need to create a Personal Access Token with access to only the specific design system repository.

At a high level, here's what you need to do:

- Fork the [design-system-docs](https://github.com/pglevy/design-system-docs) repo (*not* the design-system-server repo this file is in) to your account (i.e., `yourname/design-system-docs`)
- Create a Personal Access Token (PAT) to allow API access to your forked repo
- Copy the PAT to your local copy of the `design-system-server` repo


1. **Fork the [design-system-docs](https://github.com/pglevy/design-system-docs) repo**
   - Use the Fork button at the top of repo page
     - It will be created as a private repo in your account because the parent repo is private (for now)

1. **Create a GitHub Personal Access Token:**
   - Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
   - Click "Generate new token"
   - Give it a descriptive name like "Design System Docs Access"
   - Set expiration to your preference (90 days is recommended)
   - **Resource owner:** Select your account from the dropdown (if not already)
   - **Repository access:** Select "Selected repositories" and choose your `design-system-docs` repository
   - **Repository permissions:** Expand this section and set:
     - **Contents:** Read (this allows reading files from the repository)
     - **Metadata:** Read (this is automatically selected and required)
   - Leave all other permissions as "No access"
   - Click "Generate token"
   - **Important:** Copy the token immediately - you won't be able to see it again! (You may want to paste it in a temporary location until setup is complete.)

1. **Create a .env file:**
   - In the design-system-server folder on your machine, run this command in Terminal to copy the example environment file:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file in a text editor
     ```
     open -e .env
     ```
   - Update the values:
     - `GITHUB_TOKEN`: Replace with your actual token from previous step
     - `GITHUB_OWNER`: Replace with your GitHub username
     - `GITHUB_REPO`: Replace with your repository name (if you changed it from design-system-docs)
   - Save and close the file

1. **Rebuild the project:**
   ```
   npm run build
   ```

## Step 5: Configure Amazon Q

Now you need to tell Amazon Q where to find this design system server.

1. **Set up configuration file:**
   - Run this command in Terminal to create the empty file in the right place and open it with TextEdit:
     ```
     mkdir -p ~/.aws/amazonq && touch ~/.aws/amazonq/mcp.json && open -e ~/.aws/amazonq/mcp.json
     ```

2. **Get the full path to your project:**
   - In Terminal/Command Prompt, while in the `design-system-server` project folder, run:
     ```
     pwd
     ```
   - Copy the full path that appears and paste it somewhere handy for now (it will look something like `/Users/first.last/Desktop/design-system-server`)

3. **Edit the configuration file:**
   - Open the `mcp.json` file in VS Code or any text editor (if it's not already open in TextEdit)
   - Add this configuration (replace `YOUR_FULL_PATH_HERE` with the path you copied and leave the `/build/index.js` after the path):

   ```json
   {
       "mcpServers": {
           "design-system": {
               "command": "node",
               "args": [
                   "YOUR_FULL_PATH_HERE/build/index.js"
               ]
           }
       }
   }
   ```

4. **Save the file and restart Amazon Q**

5. **Confirm MCP configuration**
   - In a new Terminal window, type this command: `qchat mcp list`
   - You should see a reference to the file you just edited (under global:) with a `design-system` item listed

## Step 6: Set Up Your Working Project

Now that the MCP server is configured, you'll want to create a separate workspace for your design system work. This is where you'll generate and organize files before copying them into Interface Designer.

1. **Create a new project folder:**
   - Create a new folder on your Desktop called something like `design-system-work` or `my-design-project`
   - This folder will be separate from the MCP server folder you downloaded earlier

1. **Open your working folder in VS Code:**
   - Launch VS Code
   - Go to File → Open Folder
   - Select your new working project folder
   - This gives you a clean workspace for your design system files

1. **Download or copy [CLAUDE.md](https://github.com/pglevy/design-system-docs/blob/main/CLAUDE.md) from `design-system-docs`**
   - Put this file in your project folder (it provides some "tips and tricks" for Q to avoid silly SAIL mistakes)

1. **Understanding the workflow:**
   - You'll use Amazon Q chat to query the design system and generate component code
   - Amazon Q will provide you with SAIL code snippets
   - You can save these snippets as files in your VS Code project for reference
   - When ready, you'll copy and paste the final code into Interface Designer

1. **Organize your workspace:**
   - Consider creating folders like:
     - `components/` - for individual component files
     - `layouts/` - for layout patterns
     - `examples/` - for code examples and variations
     - `notes/` - for design decisions and documentation

## Step 7: Test It Out

1. Open Amazon Q chat (type `q chat` in Terminal)
2. Try asking questions like:
   - "What design system categories are available?"
   - "Show me all components in the components category"
   - "Search the design system for cards"

## Step 8: Leave Feedback

Run into a problem or have an idea for improvement? [Open an issue in `design-system-docs` using the Feedback template](https://github.com/pglevy/design-system-docs/issues/new?template=beta-feedback.md)

## Troubleshooting

**If Amazon Q can't find the server:**
- Double-check that the path in your config file is correct and absolute (starts with `/` on Mac or `C:\` on Windows)
- Make sure you ran `npm run build` successfully
- Restart Amazon Q completely

**If npm commands don't work:**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your Terminal/Command Prompt after installation

**Need help?**
- Check the main README.md file for more detailed troubleshooting
- The configuration file path must be the complete, absolute path to work properly

## What's Next?

Once set up, you can use Amazon Q to explore your design system by asking natural language questions about components, patterns, and layouts. The AI will help you find what you need without having to manually browse through documentation.