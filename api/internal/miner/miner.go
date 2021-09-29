package miner

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strconv"
)

// getHash returns HMAC sha256 as hexadecimal string
func getHash(data string) string {

	secret := "secret"

	// Create a new HMAC by defining the hash type and the key (as byte array)
	h := hmac.New(sha256.New, []byte(secret))

	// Write Data to it
	h.Write([]byte(data))

	// Get result and encode as hexadecimal string
	return hex.EncodeToString(h.Sum(nil))
}

// Mine returns nonce and hash for the given data
func Mine(data string) (int, string) {
	nonce := 1
	hash := ""

	for {
		hash = getHash(data + strconv.Itoa(nonce))
		// "0000" - difficulty for the mined hash
		if hash[:4] == "0000"  {
			break
		}
		nonce++
	}
	return nonce, hash
}
