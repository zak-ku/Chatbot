async function sendOpenAIRequest(text) {
    let requestBody = {
        model: _config.openAI_model,
        input: text,
        instructions: _config.ai_instruction,
        previous_response_id: _config.response_id,
    };
    
    if (_config.response_id.length == 0) {
        requestBody = {
            model: _config.openAI_model,
            input: text,
            instructions: _config.ai_instruction,
        };
    }
    
    try {
        const response = await fetch(_config.openAI_api, {
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        let output = data.output[0].content[0].text;
        _config.response_id = data.id;

        return output;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}