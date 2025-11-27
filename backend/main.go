package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

type AIResponse struct {
	Text string `json:"text"`
}

type UserRequest struct {
	Prompt string `json:"prompt"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("!!!API_KEY NOT SET!!!")
	}
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Post("/send", handleSendRequest)
	r.Options("/send", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	http.ListenAndServe(":8080", r)
}

func handleSendRequest(w http.ResponseWriter, r *http.Request) {
	var userRequest UserRequest
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, `error: Invalid JSON`, http.StatusBadRequest)
	}

	data, err := callAIProxy(userRequest.Prompt)
	if err != nil {
		log.Printf("❌ AI proxy error: %v", err)
		http.Error(w, "AI service unavaible", http.StatusBadRequest)
	}

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("❌ Error encoding response: %v", err)
		http.Error(w, "Internal server error", http.StatusBadRequest)
	}
}

func callAIProxy(prompt string) (AIResponse, error) {
	proxyRequest := UserRequest{Prompt: prompt}
	jsonData, err := json.Marshal(proxyRequest)
	if err != nil {
		return AIResponse{}, err
	}

	req, err := http.NewRequest("POST", "http://llm.codex.so/generate", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatal("DUDE0")
		return AIResponse{}, err
	}
	req.Header.Set("x-api-key", os.Getenv("API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return AIResponse{}, err
	}

	var aiResponse AIResponse
	if err := json.NewDecoder(resp.Body).Decode(&aiResponse); err != nil {
		return AIResponse{}, err
	}

	log.Print(aiResponse.Text)
	return aiResponse, nil
}
