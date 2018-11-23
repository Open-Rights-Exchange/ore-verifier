file( GLOB HEADERS "include/eosio/verifier_api_plugin/*.hpp" )
add_library( verifier_api_plugin
             verifier_api_plugin.cpp
             ${HEADERS} )

target_link_libraries( verifier_api_plugin verifier_plugin history_plugin chain_plugin http_plugin appbase )
target_include_directories( verifier_api_plugin PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include" )
