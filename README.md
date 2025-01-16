# Camera Mover

This project consists of a backend built with Django and Django REST framework, and a frontend built with Next.js and Tailwind CSS. The application allows you to move a camera position using keyboard arrow keys and displays the current position and focus status.

## Getting Started

### Prerequisites

- Python 3.13.0
- Node.js
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

    ```sh
    cd morphle_task
    cd backend
    ```

2. Create a virtual environment and activate it:

    ```sh
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:

    ```sh
    pip install -r requirements.txt
    ```

4. Run the Django development server:

    ```sh
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```sh
    cd ..
    cd frontend/camera_mover
    ```

2. Install the required packages:

    ```sh
    npm install
    ```

3. Run the Next.js development server:

    ```sh
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Use the arrow keys to move the camera position.
- The camera position and focus status will be displayed on the screen.

## Enhancements

- Use of websockets instead of polling
- Keep a check whether camera is going out of the slide
- Deploying the code to be used as a service
