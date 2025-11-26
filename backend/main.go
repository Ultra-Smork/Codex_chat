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

// r := chi.NewRouter()

// 	// ✅ BUILT-IN MIDDLEWARE (with single line)

// 	r.Use(middleware.Logger)
// 	r.Use(middleware.Recoverer)
// 	r.Use(middleware.Timeout(60 * time.Second))

// 	// ✅ CLEAN ROUTE DEFINITIONS
// 	r.Get("/", homeHandler)

// 	// ✅ PROPER RESTFUL ROUTING
// 	r.Route("/users", func(r chi.Router) {
// 		r.Get("/", usersHandler)       // GET /users
// 		r.Post("/", createUserHandler) // POST /users

// 		// ✅ SUB-ROUTES WITH PARAMETERS
// 		r.Route("/{userID}", func(r chi.Router) {
// 			r.Get("/", getUserHandler)       // GET /users/123
// 			r.Put("/", updateUserHandler)    // PUT /users/123
// 			r.Delete("/", deleteUserHandler) // DELETE /users/123
// 		})
// 	})

// 	// ✅ API ROUTES GROUP
// 	r.Route("/api", func(r chi.Router) {
// 		r.Route("/users", func(r chi.Router) {
// 			r.Get("/", apiUsersHandler)       // GET /api/users
// 			r.Post("/", apiCreateUserHandler) // POST /api/users

// 			r.Route("/{userID}", func(r chi.Router) {
// 				r.Get("/", apiGetUserHandler)       // GET /api/users/123
// 				r.Put("/", apiUpdateUserHandler)    // PUT /api/users/123
// 				r.Delete("/", apiDeleteUserHandler) // DELETE /api/users/123
// 			})
// 		})
// 	})

// 	// ✅ ADMIN ROUTES WITH CLEAN STRUCTURE
// 	r.Route("/admin", func(r chi.Router) {
// 		r.Get("/dashboard", adminDashboardHandler) // GET /admin/dashboard
// 		r.Get("/settings", adminSettingsHandler)   // GET /admin/settings
// 	})

// 	fmt.Println("Server running on :8080")
// 	http.ListenAndServe(":8080", r)
// }

// // ✅ CLEAN HANDLERS - NO MANUAL PATH PARSING
// func getUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID") // ✅ SIMPLE PARAM EXTRACTION
// 	fmt.Fprintf(w, "<h1>User %s</h1>", userID)
// }

// func updateUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID")
// 	fmt.Fprintf(w, "<h1>Update user %s</h1>", userID)
// }

// func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID")
// 	fmt.Fprintf(w, "<h1>Delete user %s</h1>", userID)
// }

// // ✅ CLEAN API HANDLERS
// func apiGetUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID")
// 	user := User{ID: 1, Name: "User " + userID, Email: "user@example.com"}
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(user)
// }

// func apiUpdateUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID")
// 	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "user": userID})
// }

// func apiDeleteUserHandler(w http.ResponseWriter, r *http.Request) {
// 	userID := chi.URLParam(r, "userID")
// 	json.NewEncoder(w).Encode(map[string]string{"status": "deleted", "user": userID})
// }

// // ✅ SIMPLE HANDLERS - NO MANUAL METHOD CHECKS
// func homeHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "<h1>Home Page</h1>")
// }

// func usersHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "<h1>Users List</h1>")
// }

// func createUserHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "<h1>Create User</h1>")
// }

// func apiUsersHandler(w http.ResponseWriter, r *http.Request) {
// 	users := []User{{ID: 1, Name: "John"}, {ID: 2, Name: "Jane"}}
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(users)
// }

// func apiCreateUserHandler(w http.ResponseWriter, r *http.Request) {
// 	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
// }

// func adminDashboardHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "<h1>Admin Dashboard</h1>")
// }

// func adminSettingsHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "<h1>Admin Settings</h1>")
