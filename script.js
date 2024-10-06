document.getElementById('aiForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const prompt = document.getElementById('prompt').value.trim();

      if (!prompt) {
        document.getElementById('result').textContent = 'Please enter a prompt.';
        return;
      }

      document.getElementById('result').textContent = 'Generating content...';

      try {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: prompt }),
        });

        const data = await response.json();

       
        document.getElementById('result').textContent = data.Result || 'No content generated.';
      } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
      } finally {
        document.getElementById('prompt').value = ''; 
      }
    });