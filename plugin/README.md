# THIS CODE IS NOT FUNCTIONAL - IT WAS NOT COMPLETED
# THIS CODE WAS COPIED FROM ore-protocol feature/plugin-verifier Oct 2018

# To use cpp-jwt library to enable verifier to generate JWT access token 
1. Copy ore-protocol/externals/cpp-jwt to eos/externals
2. Add ```add_subdirectory( cpp-jwt )``` in eos/externals/CMakeLists.txt

# To run the verifier plugin 
1. Copy the plugins/verifier_plugin folder to eos/plugins/
2. Add ```add_subdirectory(verifier_plugin)``` to eos/plugins/CMakeLists.txt
3. Add ```PRIVATE -Wl,${whole_archive_flag} verifier_plugin  -Wl,${no_whole_archive_flag}```
to programs/nodeos/CMakeLists.txt
4. Build:  ```./eosio_build.sh```  

#To run the verifier_api_plugin
1. Copy the plugins/verifier_api_plugin folder to eos/plugins/
2. Add ```add_subdirectory(verifier_api_plugin)``` to eos/plugins/CMakeLists.txt
3. Add ```PRIVATE -Wl,${whole_archive_flag} verifier_api_plugin  -Wl,${no_whole_archive_flag}```
to eos/programs/nodeos/CMakeLists.txt
4. Build:  ```./eosio_build.sh```  


#Run the eos blockchain 
Run ./nodeos -e -p eosio --plugin eosio::chain_api_plugin --plugin eosio::wallet_api_plugin  --plugin eosio::http_plugin --plugin eosio::chain_plugin --plugin eosio::verifier_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::verifier_api_plugin --plugin eosio::http_client_plugin --replay-blockchain  --delete-all-blocks --contracts-console

