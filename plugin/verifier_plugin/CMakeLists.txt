file(GLOB HEADERS "include/eosio/verifier_plugin/*.hpp")
include_directories(${OPENSSL_INCLUDE_DIR})
link_directories(${OPENSSL_LIBRARIES})

SET(CERT_ROOT_DIR "${CMAKE_CURRENT_SOURCE_DIR}/rsa_256")
SET(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} -DCERT_ROOT_DIR=\"\\\"${CERT_ROOT_DIR}\\\"\"")

add_library( verifier_plugin
             verifier_plugin.cpp
             ${HEADERS} )

target_link_libraries( verifier_plugin chain_plugin eosio_chain appbase fc )
target_include_directories( verifier_plugin PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include" "${CMAKE_CURRENT_SOURCE_DIR}/../../externals/cpp-jwt/include" )
